package utils

import (
	"bufio"
	"fmt"
	"io"
	"io/ioutil"
	"log"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/google/uuid"
)

func InitLogIndex() {
	var LogIndexFileName = "log_index"

	fileHandle, err := os.Create(LogIndexFileName)
	if err != nil {
		fmt.Printf(err.Error())
	}

	var start_timestamp = strconv.FormatInt(time.Now().UTC().UnixNano(), 10)
	fileHandle.WriteString(
		fmt.Sprintf("<log_index:start>;<log_timestamp:%s>\n",
			start_timestamp))

	fileHandle.Sync()
}

func CreateLogIndexRecord(log_uuid string, start_byte int, end_byte int) {
	fileHandle, err := os.OpenFile("log_index", os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
	if err != nil {
		fmt.Printf(err.Error())
	}
	defer fileHandle.Close()

	fileHandle.WriteString(fmt.Sprintf("%s:%d:%d\n", log_uuid, start_byte, end_byte))

	fileHandle.Sync()

	fmt.Printf("Add log entry to index\n")
}

func PrintLogIndex() {
	filebuffer, err := ioutil.ReadFile("log_index")
	if err != nil {
		fmt.Printf(err.Error())
	}
	var logs = string(filebuffer)
	fmt.Printf(logs)
}

func InitLogFile() string {
	var log_uuid, _ = uuid.NewRandom()
	var logFilePath = fmt.Sprintf("log_%s.log", log_uuid)

	fileHandle, err := os.Create(logFilePath)
	if err != nil {
		fmt.Printf(err.Error())
	}

	var start_timestamp = strconv.FormatInt(time.Now().UTC().UnixNano(), 10)
	fileHandle.WriteString(
		fmt.Sprintf("<log:start>;<log_id:%s>;<log_timestamp:%s>\n",
			log_uuid,
			start_timestamp))

	fileHandle.Sync()

	return logFilePath
}

func AppendRecord(logFilePath string, log_lines []string) {
	fileHandle, err := os.OpenFile(logFilePath, os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
	if err != nil {
		fmt.Printf(err.Error())
	}
	defer fileHandle.Close()

	log_start, _ := fileHandle.Seek(0, io.SeekEnd)

	var record_uuid, _ = uuid.NewRandom()

	var start_timestamp = strconv.FormatInt(time.Now().UTC().UnixNano(), 10)
	fileHandle.WriteString(fmt.Sprintf("<record:start>;<record_id:%s>;<record_timestamp:%s>\n", record_uuid, start_timestamp))

	byte_count := 0
	for i := 0; i < len(log_lines); i++ {
		n, _ := fileHandle.WriteString(log_lines[i] + "\n")
		byte_count += n
	}
	var end_timestamp = strconv.FormatInt(time.Now().UTC().UnixNano(), 10)
	fileHandle.WriteString(fmt.Sprintf("<record:end>;<record_id:%s>;<record_timestamp:%s>\n", record_uuid, end_timestamp))

	fileHandle.Sync()

	log_end, _ := fileHandle.Seek(0, io.SeekEnd)

	CreateLogIndexRecord(record_uuid.String(), int(log_start), int(log_end))

	fmt.Printf("Wrote %d bytes to log file %s\n", byte_count, logFilePath)
}

func PrintLogsByOffset(fileLocation string, startOffset int, endOffset int) {
	filebuffer, err := os.Open(fileLocation)
	if err != nil {
		fmt.Printf(err.Error())
	}

	_, err = filebuffer.Seek(int64(startOffset), io.SeekStart)
	if err != nil {
		fmt.Printf(err.Error())
	}
	buf := make([]byte, endOffset-startOffset)
	n, err := filebuffer.Read(buf[:cap(buf)])
	buf = buf[:n]
	if err != nil {
		if err != io.EOF {
			fmt.Printf(err.Error())
		}
	}
	fmt.Printf("%s\n", buf)
}

func GetRecordOffsetByUUID(uuid string) (int, int) {
	f, err := os.OpenFile("log_index", os.O_RDONLY, os.ModePerm)
	if err != nil {
		fmt.Printf("open file error: %v", err)
		return -1, -1
	}
	defer f.Close()

	sc := bufio.NewScanner(f)
	for sc.Scan() {
		log_line := sc.Text()

		tokens := strings.Split(log_line, ":")
		start_offset, _ := strconv.ParseInt(tokens[1], 0, 64)
		end_offset, _ := strconv.ParseInt(tokens[2], 0, 64)
		if tokens[0] == uuid {
			return int(start_offset), int(end_offset)
		}
	}
	if err := sc.Err(); err != nil {
		log.Fatalf("scan file error: %v", err)
		return -1, -1
	}

	return -1, -1
}

func PrintLogByUUID(fileLocation string, uuid string) {
	start_offset, end_offset := GetRecordOffsetByUUID(uuid)
	PrintLogsByOffset(fileLocation, start_offset, end_offset)
}
