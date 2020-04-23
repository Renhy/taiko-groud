package com.renhy.server.taiko.song;

import com.alibaba.fastjson.JSON;
import com.renhy.server.taiko.entity.Diffculty;
import com.renhy.server.taiko.entity.MusicEntity;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class Music {


    private String id;

    private String songId;

    private Diffculty diffculty;

    private int level;

    private Info info = new Info();

    private List<String> content = new ArrayList<>();


    public static Music fromEntity(MusicEntity entity) {
        Music music = new Music();

        music.setId(entity.getId());
        music.setSongId(entity.getSongId());
        music.setDiffculty(entity.getDiffculty());
        music.setLevel(entity.getLevel());
        music.setInfo(JSON.parseObject(entity.getInfo(), Info.class));
        music.setContent(JSON.parseArray(entity.getContent(), String.class));

        return music;
    }

    public void importInfo(MusicEntity entity) {
        entity.setDiffculty(this.diffculty);
        entity.setLevel(this.level);
        entity.setInfo(JSON.toJSONString(this.info));
        entity.setContent(JSON.toJSONString(this.content));
    }


    @Data
    public static class Info {
        private List<Integer> balloons = new ArrayList<>();

        private double scoreInit;

        private double scoreDiff;

    }



}
