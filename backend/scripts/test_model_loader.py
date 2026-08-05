from ml.inference.model_loader import ModelLoader


def main():

    model = ModelLoader.load()

    print()

    print("Model loaded successfully!")

    print()

    print(model)


if __name__ == "__main__":
    main()