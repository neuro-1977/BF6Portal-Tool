# Expected Battlefield Portal Blocks Reference
# Based on common Battlefield Portal blocks that should be in screenshots

## MATH BLOCKS (Expected)

### Basic Operations
- Add (A + B) - VALUE block, 2 number params
- Subtract (A - B) - VALUE block, 2 number params  
- Multiply (A × B) - VALUE block, 2 number params
- Divide (A ÷ B) - VALUE block, 2 number params
- Modulo (A % B) - VALUE block, 2 number params

### Advanced Math
- Power (A ^ B) - VALUE block, 2 number params
- Square Root - VALUE block, 1 number param
- Absolute Value - VALUE block, 1 number param
- Round - VALUE block, 1 number param (options: floor, ceil, round)
- Random Number - VALUE block, params: min, max

### Trigonometry (if present)
- Sin - VALUE block, 1 angle param
- Cos - VALUE block, 1 angle param
- Tan - VALUE block, 1 angle param

### Comparisons
- Less Than (A < B) - CONDITION block
- Greater Than (A > B) - CONDITION block
- Equal (A == B) - CONDITION block
- Less or Equal (A <= B) - CONDITION block
- Greater or Equal (A >= B) - CONDITION block
- Not Equal (A != B) - CONDITION block

### Special
- Min (minimum of A, B) - VALUE block
- Max (maximum of A, B) - VALUE block
- Clamp (clamp value between min and max) - VALUE block, 3 params
- Number constant - VALUE block, number input

---

## ARRAY BLOCKS (Expected)

### Array Creation
- Create Empty Array - VALUE block, no params
- Array Literal - VALUE block, list of values
- Array of Size - VALUE block, size param

### Array Access
- Get Array Element - VALUE block, params: array, index
- Set Array Element - ACTION block, params: array, index, value
- Array Length - VALUE block, param: array

### Array Operations
- Add to Array - ACTION block, params: array, value
- Remove from Array - ACTION block, params: array, index/value
- Clear Array - ACTION block, param: array
- Contains - CONDITION block, params: array, value
- Index Of - VALUE block, params: array, value

### Array Iteration
