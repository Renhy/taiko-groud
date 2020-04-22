package com.renhy.server.taiko.song;

import com.renhy.server.taiko.common.BusException;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;


@Slf4j
@Data
public abstract class Parser {


    abstract Result go(List<String> lines);




    public static Result parse(MultipartFile file) {
        return parse(file, "Shift_JIS");
    }

    public static Result parse(MultipartFile file, String charset) {
        try {
            List<String> lines = new ArrayList<>();
            try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream(), charset))) {
                for(;;) {
                    String line = reader.readLine();
                    if (line == null) {
                        break;
                    }

                    lines.add(line);
                }
            }


            String suffix = clipSuffix(file.getOriginalFilename());
            if ("tja".equals(suffix)) {
                return new TjaParser().go(lines);
            }

            throw new BusException("不支持的文件格式");
        } catch (Exception e) {
            log.error("error in parse song file. ", e);
            throw new BusException("解析失败，请重试");
        }
    }


    @Data
    public static class Result {

        private Song song;

        private List<Music> musics;

    }


    public static String clipSuffix(String name) {
        int index = name.lastIndexOf(".");

        if (index <= 0) {
            return null;
        }

        if (index >= name.length() - 1) {
            return null;
        }

        return name.substring(index + 1).toLowerCase();
    }

}
