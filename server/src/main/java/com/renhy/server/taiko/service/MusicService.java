package com.renhy.server.taiko.service;

import com.renhy.server.taiko.entity.Diffculty;
import com.renhy.server.taiko.song.Music;

import java.util.List;

public interface MusicService {


    Music getBySongTagAndDiffculty(String tag, Diffculty diffculty);

    boolean save(String songId, List<Music> musicList);




}
