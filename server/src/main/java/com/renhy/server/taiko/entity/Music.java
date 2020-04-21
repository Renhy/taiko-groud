package com.renhy.server.taiko.entity;

import com.baomidou.mybatisplus.activerecord.Model;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serializable;


@Data
@EqualsAndHashCode(callSuper = true)
public class Music extends Model<Music> {

    private String id;

    private String songId;

    private int level;

    private String info;

    private String content;

    @Override
    protected Serializable pkVal() {
        return this.id;
    }
}
