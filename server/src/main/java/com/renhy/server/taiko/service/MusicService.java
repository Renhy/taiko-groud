package com.renhy.server.taiko.service;

import com.renhy.server.taiko.song.Music;

import java.util.List;

public interface MusicService {



    boolean save(String songId, List<Music> musicList);



}
