package com.renhy.server.taiko.entity;

import com.baomidou.mybatisplus.activerecord.Model;
import com.baomidou.mybatisplus.annotations.TableName;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serializable;


@Data
@EqualsAndHashCode(callSuper = true)
@TableName("music")
public class MusicEntity extends Model<MusicEntity> {

    private String id;

    private String songId;

    private Diffculty diffculty;

    private int level;

    private String info;

    private String content;

    @Override
    protected Serializable pkVal() {
        return this.id;
    }
}
