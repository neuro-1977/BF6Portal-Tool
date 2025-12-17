<#
.SYNOPSIS
  Cleans up Electron build output folders (dist variants) safely.

.DESCRIPTION
  Electron builder outputs can become undeletable if an app instance is still
  running and holding a lock on win-unpacked\resources\app.asar.

  This script:
    - Detects lock state via a safe rename test
    - Skips folders that are locked
    - Deletes folders that are not locked

.PARAMETER Keep
  Output folder name to keep (default: dist-test).

.EXAMPLE
  pwsh -File tools\cleanup_dist.ps1

.EXAMPLE
  pwsh -File tools\cleanup_dist.ps1 -Keep dist
#>

[CmdletBinding()]
param(
  [string]$Keep = 'dist-test'
)

$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
Set-Location -LiteralPath $root

$targets = @('dist','dist-dev','dist-alt','dist-test') | Where-Object { $_ -ne $Keep }

function Test-AsarLock([string]$folderName) {
  $asar = Join-Path $root (Join-Path $folderName 'win-unpacked\resources\app.asar')
  if (-not (Test-Path -LiteralPath $asar)) {
    return @{ Exists = $false; Locked = $false; Path = $asar }
  }

  $tmpName = 'app.asar.__locktest'
  $tmp = Join-Path (Split-Path -Parent $asar) $tmpName

  try {
    Rename-Item -LiteralPath $asar -NewName $tmpName -ErrorAction Stop
    Rename-Item -LiteralPath $tmp -NewName 'app.asar' -ErrorAction Stop
    return @{ Exists = $true; Locked = $false; Path = $asar }
  } catch {
    # Try to restore if we renamed it but failed to rename back.
    if (Test-Path -LiteralPath $tmp) {
      try { Rename-Item -LiteralPath $tmp -NewName 'app.asar' -ErrorAction SilentlyContinue } catch {}
    }
    return @{ Exists = $true; Locked = $true; Path = $asar; Error = $_.Exception.Message }
  }
}

Write-Host "Repo: $root"
Write-Host "Keeping: $Keep"
Write-Host ""

foreach ($d in $targets) {
  $full = Join-Path $root $d
  if (-not (Test-Path -LiteralPath $full)) {
    Write-Host "[skip] $d (missing)"
    continue
  }

  $lock = Test-AsarLock -folderName $d

  if ($lock.Exists -and $lock.Locked) {
    Write-Host "[skip] $d (LOCKED app.asar)"
    Write-Host "       $($lock.Path)"
    Write-Host "       $($lock.Error)"
    continue
  }

  Write-Host "[delete] $d"
  try {
    Remove-Item -LiteralPath $full -Recurse -Force
  } catch {
    Write-Host "[warn] Failed to delete $d: $($_.Exception.Message)"
  }
}

Write-Host ""
Write-Host "Done."