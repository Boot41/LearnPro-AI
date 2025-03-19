import json
def parse_requirements(requirements_str: str):
    """
    Parses a requirements.txt file to extract a list of dependencies.
    This implementation splits lines and removes comments/version specifiers.
    """
    dependencies = []
    for line in requirements_str.splitlines():
        line = line.strip()
        if line and not line.startswith("#"):
            # Here, we take only the package name (before version specifiers)
            dependency = line.split("==")[0].strip()
            dependencies.append(dependency)
    return dependencies

def parse_package_json(package_json_str: str):
    """
    Parses a package.json file and extracts dependencies from both
    "dependencies" and "devDependencies" sections.
    """
    data = json.loads(package_json_str)
    dependencies = []
    for dep_type in ["dependencies", "devDependencies"]:
        deps = data.get(dep_type, {})
        dependencies.extend(list(deps.keys()))
    return dependencies