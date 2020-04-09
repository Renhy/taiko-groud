package com.renhy.server.taiko.dao;

import com.renhy.server.taiko.entity.Song;
import org.springframework.data.repository.CrudRepository;

public interface SongRepository extends CrudRepository<Song, String> {
}
