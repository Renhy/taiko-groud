package com.renhy.server.taiko.song;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.InputStreamReader;
import java.nio.charset.Charset;
import java.util.Map;


@Slf4j
@Component
public class SongManager {



    public static void main(String[] args) throws Exception {

        Map<String, Charset> charsetMap = Charset.availableCharsets();

        String dir = "/Users/renhy/Desktop/taikojiro/02A NAMCO-POP/";

        File root = new File(dir);
        for (File file : root.listFiles()) {
            String name = file.getName();

            if (file.isDirectory()) {
                listDirectory(file);
            } else {
                if (!name.contains("tja")) {
                    continue;
                }
                readFile(file);
            }
        }
    }

    static private void listDirectory(File dir) {
        for (File file : dir.listFiles()) {
            if (file.isDirectory()) {
                listDirectory(file);
            } else {
                readFile(file);
            }
        }
    }

    static private void readFile(File file) {
        System.out.println();
        System.out.println(file.getName());
        try {

            try (BufferedReader reader = new BufferedReader(new InputStreamReader(new FileInputStream(file), "Shift_JIS"))) {
                for (;;) {
                    String line = reader.readLine();
                    if (line == null) {
                        break;
                    }
                    System.out.println(line);
                    break;
                }
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
    }



}
