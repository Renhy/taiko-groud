package com.renhy.server.taiko.service;

import com.renhy.server.taiko.entity.Category;
import com.renhy.server.taiko.entity.SongEntity;
import com.renhy.server.taiko.song.Song;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface SongService {


    List<SongEntity> list();


    Song getById(String id);

    Song getById(String id, boolean validateNotNull);

    Song getByTag(String tag);

    Song getByTag(String tag, boolean validateNotNull);

    Song load(Category category, MultipartFile song, MultipartFile wave);

    boolean updateWave(String id, MultipartFile file);

    boolean delete(String id);



}
