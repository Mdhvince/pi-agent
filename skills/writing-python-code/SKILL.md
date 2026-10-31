---
name: writing-python-code
description: Skills that define the user preferences to write python code
---

# Writing Python code
Use this skill when writing python code

# General practices
- Avoid "bricolage" and custom implementations of functionality already present in the Python standard library (stdlib). Always check the stdlib before suggesting a third-party package or a custom helper.
- Follow `writing-python-code/guidelines/guidelines.md`
- Imports built-ins first, then external libraries, then project files (all separated by a new blank line)
- Always use Type Hints
- Use `X | None` instead of `Optional[X]` for type annotations (PEP 604)
- Use built-in generics (e.g., `list`, `dict`, `tuple`) instead of `typing` equivalents (e.g., `List`, `Dict`, `Tuple`) for type annotations (PEP 585)
- Overrides PEP-8 max characters by writing max 121 characters. Do not break the line unless the one line degrades readability
- Use `" "` instead of `' '` for strings when possible
- Prefer ONE LINE formatting for constructs where it cannot degrade readability (function signatures, variable assignments, calls, class definitions), unless the 121 chars limit is reached. Loops, conditionals, and multi-step bodies are out of scope: expand them whenever expansion aids reading
- Prefer pathlib over os.path
- Prefer absolute imports statement over relative ones
- Use accurate and simplified english words for variables / functions / classes / comments / docstrings

# Rest-ish docstrings
For docstrings, unless the project follows a particular convention, the docstring should start with a very short sentence
that says the intent of the function (placed a line below the `"""`. This sentence is followed by :param: and :return: if not none.
The docstring must not repeat the parameter type because it is already in the signature. 
Talk, Write, Communicate in `ASD-STE100` Simplified Technical English when communicating or writing in english.


Example:
```python
def add(x: float | int, y: float | int) -> float | int:
    """
    This function adds two numbers together.
    :param x: The first number
    :param y: The second number
    :return: The sum of the two numbers.
    """
```

# Tests
- Follow testing practices in `screening-tests`
- Use AAA pattern (Arrange, Act, Assert)
- Prefer function-based tests over class-based tests
- No docstring in tests, the name of the function must document the test
- The name of the test file must follow this pattern unless another pattern is used in the project: `test_name_of_the_file_we_are_testing.py`

# Styling

## Order of preference for function signature (from best to worst)

1. Best
```
def foo(a: type, b: type, c: type, d: type) -> type:
    ...
```
2. If over 121 chars (one argument per line), arguments are on the exact same starting column
```
def foo(a: type,
        b: type,
        c: type,
        d: type) -> type:
    ...
```
3. You should not go this far
```
def foo(
    a: type, b: type, c: type, d: type
) -> type:
```

## Other formatting
- Add a blank line between relevant parts (when applicable) inside a function to avoid one big paragraph
- Declare aliases when a type hint becomes too long and is repeated several times
- Always check for `PEP 8: E128 continuation line under-indented for visual indent` and fix them


# Forbidden practices
- Assertion instead of raising an exception in production code (Assert must stays in the tests)
- Avoid when possible global variables
- No functions under `if __name__ == "__main__":` clause (even if it is idented back)
- Comments that are not useful or that repeat what the code is doing
- Assigning a variable to another variable without adding anything else instead of using the original variable
