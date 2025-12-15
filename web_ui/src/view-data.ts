document.addEventListener('DOMContentLoaded', () => {
  fetch('/api/data')
    .then(response => response.json())
    .then(data => {
      const container = document.getElementById('data-container');
      if (container) {
        let html = '<table>';
        html += '<tr><th>ID</th><th>File Path</th><th>Content</th><th>Visual Representation</th></tr>';
        data.forEach((row: any) => {
          let svgHtml = '';
          if (row.svgs) {
            svgHtml = row.svgs.join('<br>');
          }
          html += `<tr><td>${row.id}</td><td>${row.file_path}</td><td><pre>${row.content}</pre></td><td>${svgHtml}</td></tr>`;
        });
        html += '</table>';
        container.innerHTML = html;
      }
    })
    .catch(error => console.error('Error fetching data:', error));
});
