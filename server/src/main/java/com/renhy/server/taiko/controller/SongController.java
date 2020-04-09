package com.renhy.server.taiko.controller;

import com.renhy.server.taiko.common.BusException;
import com.renhy.server.taiko.common.Response;
import com.renhy.server.taiko.dao.SongRepository;
import com.renhy.server.taiko.entity.Song;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@RequestMapping("/song")
public class SongController {


    @Autowired
    private SongRepository songRepository;

    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    public Response getSongById(@PathVariable("id") String id) {
        Optional<Song> song = songRepository.findById(id);
        if (song.isPresent()) {
            return Response.success(song.get());
        }

        throw new BusException("曲目未找到");
    }


}
