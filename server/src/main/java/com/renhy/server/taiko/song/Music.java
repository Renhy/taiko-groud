package com.renhy.server.taiko.song;

import com.alibaba.fastjson.JSON;
import com.renhy.server.taiko.entity.Diffculty;
import com.renhy.server.taiko.entity.MusicEntity;
import lombok.Data;

import java.util.List;

@Data
public class Music {


    private String id;

    private String songId;

    private Diffculty diffculty;

    private int level;

    private Info info;

    private List<String> content;


    public static Music fromEntity(MusicEntity entity) {
        Music music = new Music();

        music.setId(entity.getId());
        music.setSongId(entity.getSongId());
        music.setDiffculty(entity.getDiffculty());
        music.setLevel(entity.getLevel());
        music.setInfo(JSON.parseObject(entity.getContent(), Info.class));
        music.setContent(JSON.parseArray(entity.getContent(), String.class));

        return music;
    }


    @Data
    public static class Info {
        private List<Integer> balloons;

        private double scoreInit;

        private double scoreDiff;

    }



}
