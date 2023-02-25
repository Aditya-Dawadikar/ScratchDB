package services

import (
	"fmt"
	"io/ioutil"
	"os"
)

func WriteToFile(fileLocation string, jsonString string) (result int) {
	bytesArray := []byte(jsonString)
	var err = ioutil.WriteFile(fileLocation, bytesArray, os.ModePerm)
	if err != nil {
		fmt.Printf(err.Error())
		return -1
	} else {
		fmt.Printf("Successfully created file %s", fileLocation)
		return 1
	}
}

func ReadFromFile(fileLocation string) (result *string) {
	bytesArray, err := os.ReadFile(fileLocation)
	if err != nil {
		fmt.Printf(err.Error())
		return nil
	}
	jsonString := string(bytesArray[:])
	return &jsonString
}
