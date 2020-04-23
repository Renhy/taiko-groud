package com.renhy.server.taiko.controller;

import com.renhy.server.taiko.common.Response;
import com.renhy.server.taiko.entity.Diffculty;
import com.renhy.server.taiko.service.MusicService;
import com.renhy.server.taiko.service.SongService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/play")
public class PlayController {



    @Autowired
    private SongService songService;


    @Autowired
    private MusicService musicService;


    @RequestMapping(value = "/{tag}", method = RequestMethod.GET)
    public Response getSongByTag(@PathVariable("tag") String tag) {
        return Response.success(
                songService.getByTag(tag, true));
    }


    @RequestMapping(value = "/{tag}/music", method = RequestMethod.GET)
    public Response getMusic(@PathVariable("tag") String tag, @RequestParam("diff") Diffculty diffculty) {
        return Response.success(
                musicService.getBySongTagAndDiffculty(tag, diffculty));
    }



}
