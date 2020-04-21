package com.renhy.server.taiko.service;

import com.renhy.server.taiko.entity.Song;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface SongService {


    List<Song> list();


    Song getById(String id);

    Song getById(String id, boolean validateNotNull);

    Song load(MultipartFile file);

    Song updateWave(String id, MultipartFile file);


}
