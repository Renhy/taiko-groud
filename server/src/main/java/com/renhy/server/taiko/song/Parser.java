package com.renhy.server.taiko.song;

import com.renhy.server.taiko.common.BusException;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

import static com.renhy.server.taiko.common.StringUtils.getSuffix;


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


            String suffix = getSuffix(file.getOriginalFilename());
            if (suffix == null) {
                throw new BusException("不支持的文件格式");
            }

            suffix = suffix.toLowerCase();
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
    @AllArgsConstructor
    public static class Result {

        private Song song;

        private List<Music> musics;


    }

}
