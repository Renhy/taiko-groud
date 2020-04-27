package com.renhy.server.taiko.service;

import com.renhy.server.taiko.common.BusException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Paths;
import java.security.MessageDigest;

import static com.renhy.server.taiko.common.StringUtils.toHexString;

@Slf4j
@Service
public class StorageServiceImpl implements StorageService {


    @Value("${upload.root}")
    private String root;


    @Override
    public String stock(MultipartFile file) {
        try {
            String url = toUrl(file.getOriginalFilename());
            file.transferTo(Paths.get(root, url));

            return url;
        } catch (Exception e) {
            log.error("Error in storage file: ", e);
            throw new BusException("存储文件出错");
        }
    }


    private String toUrl(String fileName) {
        try {
            byte[] hashedBytes = MessageDigest.getInstance("MD5").digest(fileName.getBytes());
            String dir = "storage/" + toHexString(hashedBytes).substring(0, 2) + "/";

            if (Files.notExists(Paths.get(root, dir))) {
                Files.createDirectories(Paths.get(root, dir));
            }

            String url =  dir + fileName;
            if (Files.notExists(Paths.get(root, url))) {
                return url;
            }

            int index = url.lastIndexOf(".");
            for(int i = 1; i < 100; i++) {
                String newUrl = new StringBuilder(url).insert(index, i).toString();
                if (Files.notExists(Paths.get(root, newUrl))) {
                    return newUrl;
                }
            }

            throw new BusException("相似文件名重复过多，请重试");
        } catch (Exception e) {
            return fileName;
        }
    }


}
