package com.renhy.server.taiko.service;

import com.renhy.server.taiko.entity.SongEntity;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface SongService {


    List<SongEntity> list();


    SongEntity getById(String id);

    SongEntity getById(String id, boolean validateNotNull);

    SongEntity load(MultipartFile song, MultipartFile wave);

    SongEntity updateWave(String id, MultipartFile file);

    boolean delete(String id);



}
