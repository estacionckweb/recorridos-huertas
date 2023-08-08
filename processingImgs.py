# importar PIL para procesar las imágenes
from PIL import Image
# importar os para obtener los archivos de un directorio
import os
# importar argparse para obtener los argumentos
import argparse

# funcion para obtener el número de teléfono del nombre del archivo
def getPhoneFromFileName(file_name):
    # separar el nombre del archivo por @
    file_name = file_name.split('@')
    # obtener el número de teléfono
    phone = file_name[0]
    # retornar el número de teléfono
    return phone

# Funcion para obtener las imagenes de un directorio
def getImages(directory):
    # todos los archivos del directorio
    files = os.listdir(directory)
    # un arreglo para las imagenes
    images = []
    # loop por cada archivo
    for file in files:
        # si el archivo es una imagen
        if file.endswith('.jpg') or file.endswith('.png') or file.endswith('.jpeg') or file.endswith('.JPEG') or file.endswith('.JPG') or file.endswith('.PNG'):
            # agregar el archivo a la lista
            images.append(file)
    # devolver la lista de imagenes
    return images

# Funcion para procesar las imagenes
def processImages(directory, images, outputDirectory):
    # loop por cada imagen
    for image in images:
        # obtener el número de teléfono del nombre del archivo
        phone = getPhoneFromFileName(image)
        # abrir la imagen
        img = Image.open(directory + image)
        # obtener el ancho y alto de la imagen
        width, height = img.size
        # obtener el ratio de la imagen
        if width > height:
            ratio = width / 1000
            newWidth = 1000
            newHeight = int(height / ratio)
        else:
            ratio = height / 1000
            newHeight = 1000
            newWidth = int(width / ratio)
        # escalar la imagen
        img_large = img.resize((newWidth, newHeight), Image.ANTIALIAS)

        # escalar la imagen para que el lado más largo sea de 400px
        if width > height:
            ratio = width / 400
            newWidth = 400
            newHeight = int(height / ratio)
        else:
            ratio = height / 400
            newHeight = 400
            newWidth = int(width / ratio)
        # escalar la imagen
        img_small = img.resize((newWidth, newHeight), Image.ANTIALIAS)

        # nueva ruta dentro del directorio con una nueva carpeta con el número de teléfono
        outputDirectory_temp = outputDirectory + phone + '/'
        
        # crear el directorio si no existe
        if not os.path.exists(outputDirectory_temp):
            os.makedirs(outputDirectory_temp)

        # contar las imagenes en el directorio
        index = len(os.listdir(outputDirectory_temp))
        # guardar la imagen
        img_large.save(outputDirectory_temp + 'resized_' + str(index) + '.jpg', 'JPEG')
        img_small.save(outputDirectory_temp + 'resized_small_' + str(index) + '.jpg', 'JPEG')

# define a function to run the program
def main(directory, outputDirectory):
    # obtener las imagenes del directorio
    images = getImages(directory)
    # procesar las imagenes
    processImages(directory, images, outputDirectory)


if __name__ == '__main__':
    # argumento para la ruta de los archivos
    parser = argparse.ArgumentParser(description='Procesar archivos para la plataforma de huertas urbanas')
    # --ruta es el argumento que se va a usar
    parser.add_argument('--ruta', type=str, help='Ruta de los archivos a procesar')
    # --output es el argumento que se va a usar
    parser.add_argument('--output', type=str, help='Ruta de los archivos procesados')

    # obtener los argumentos
    args = parser.parse_args()
    # run the program
    main(args.ruta, args.output)