import os
import sys
import pathlib
import ast
import json


def main():
    py_files = []
    for (dirpath, _dirnames, filenames) in os.walk(sys.argv[1]):
        for fname in filenames:
            full_path = pathlib.Path(dirpath) / fname
            if full_path.suffix == ".py":
                py_files.append(full_path)

    files_info = []
    for py_filename in py_files:
        with open(py_filename, "rt") as f_in:
            code_text = f_in.read()
            code = ast.parse(code_text, py_filename)
            doc = ast.get_docstring(code)
            if doc is None:
                print(f"{py_filename}: no docstring", file=sys.stderr)
            else:
                doc_pieces = doc.strip().split("\n\n", 1)
                if len(doc_pieces) != 2:
                    print(f"{py_filename}: malformed docstring", file=sys.stderr)
                else:
                    name, doc_body = doc_pieces
                    files_info.append(
                        {
                            "path": py_filename.name,
                            "name": name,
                            "docMarkdown": doc_body,
                        }
                    )

    print(json.dumps(files_info))


if __name__ == "__main__":
    main()
