from ml.pipelines.scheme_generator import SchemeGenerator


def main():
    generator = SchemeGenerator()

    schemes = generator.get_all_schemes()

    print(f"Total Schemes: {len(schemes)}")

    print()

    for scheme in schemes:
        print(scheme["scheme_name"])


if __name__ == "__main__":
    main()