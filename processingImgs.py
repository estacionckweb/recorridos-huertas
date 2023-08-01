# import Pillow for image processing
from PIL import Image
# import os for file handling
import os

#define a function to get all the images in a directory
def getImages(directory):
    # get all the files in the directory
    files = os.listdir(directory)
    # create a list to store the images
    images = []
    # loop through the files
    for file in files:
        # check if the file is an image
        if file.endswith('.jpg') or file.endswith('.png') or file.endswith('.jpeg') or file.endswith('.JPEG') or file.endswith('.JPG') or file.endswith('.PNG'):
            # add the image to the list
            images.append(file)
    # return the list of images
    return images

# define a function to process the images
def processImages(directory, images, outputDirectory):
    # loop through the images
    for image in images:
        # get index of loop
        index = images.index(image)
        # open the image
        img = Image.open(directory + image)
        # get the width and height of the image
        width, height = img.size
        #resize the image so the maximum dimension is 1000
        if width > height:
            ratio = width / 1000
            newWidth = 1000
            newHeight = int(height / ratio)
        else:
            ratio = height / 1000
            newHeight = 1000
            newWidth = int(width / ratio)
        # resize the image
        img_large = img.resize((newWidth, newHeight), Image.ANTIALIAS)

        #resize the image so the maximum dimension is 400
        if width > height:
            ratio = width / 400
            newWidth = 400
            newHeight = int(height / ratio)
        else:
            ratio = height / 400
            newHeight = 400
            newWidth = int(width / ratio)
        # resize the image
        img_small = img.resize((newWidth, newHeight), Image.ANTIALIAS)
        
        # if output directory does not exist, create it
        if not os.path.exists(outputDirectory):
            os.makedirs(outputDirectory)
        # save the image
        img_large.save(outputDirectory + 'resized_' + str(index) + '.jpg', 'JPEG')
        img_small.save(outputDirectory + 'resized_small_' + str(index) + '.jpg', 'JPEG')

# define a function to run the program
def main():
    # get directory from terminal
    directory = input('Enter the directory: ')
    # get output directory from terminal
    outputDirectory = input('Enter the output directory: ')

    if not directory.endswith('/'):
        directory += '/'
    if not outputDirectory.endswith('/'):
        outputDirectory += '/'

    # get the images
    images = getImages(directory)
    # process the images
    processImages(directory, images, outputDirectory)
    # print a message
    print('Images processed')

# run the program
main()