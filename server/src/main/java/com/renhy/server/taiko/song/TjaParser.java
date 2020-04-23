package com.renhy.server.taiko.song;

import com.renhy.server.taiko.common.BusException;
import com.renhy.server.taiko.entity.Diffculty;
import org.springframework.util.StringUtils;

import java.util.*;

public class TjaParser extends Parser {

    private static final Diffculty[] levelOrders = {
            Diffculty.EASY,
            Diffculty.NORMAL,
            Diffculty.HARD,
            Diffculty.EXTREME,
            Diffculty.EXTRA
    };

    @Override
    Result go(List<String> lines) {

        Song song = parseHeader(lines);

        List<Music> musicList = parseMusic(lines);

        Map<Diffculty, Integer> levels = new HashMap<>();
        for (Music music : musicList) {
            levels.put(music.getDiffculty(), music.getLevel());
        }
        for (Diffculty dif : levelOrders) {
            if (levels.containsKey(dif)) {
                song.getMusicLevels().add(levels.get(dif));
            }
        }

        return new Result(song, musicList);
    }

    private Song parseHeader(List<String> lines) {
        Song song = new Song();

        for (String line : lines) {
            if (line.contains("SUBTITLE")) {
                song.setSubTitle(line.replace("SUBTITLE:", "").trim());
                continue;
            }

            if (line.contains("TITLE")) {
                song.setTitle(line.replace("TITLE:", "").trim());
                continue;
            }

            if (line.contains("BPM")) {
                String bpm = line.substring(line.indexOf(":") + 1);
                if (bpm.contains("-")) {
                    bpm = bpm.substring(0, bpm.indexOf("-") - 1);
                }
                song.setBpm(Integer.parseInt(bpm));
                continue;
            }

            if (line.contains("OFFSET")) {
                song.getMetadata().setOffset(Double.parseDouble(
                        line.substring(line.indexOf(":") + 1)));
            }

            if (line.contains("SONGVOL")) {
                song.getMetadata().setSongVol(Double.parseDouble(
                        line.substring(line.indexOf(":") + 1)));
            }

            if (line.contains("SEVOL")) {
                song.getMetadata().setSeVol(Double.parseDouble(
                        line.substring(line.indexOf(":") + 1)));
            }

            if (line.contains("DEMOSTART")) {
                song.getMetadata().setDemoStart(Double.parseDouble(
                        line.substring(line.indexOf(":") + 1)));
            }

            if (line.contains("COURSE")) {
                return song;
            }
        }

        return song;
    }

    private List<Music> parseMusic(List<String> lines) {
        List<Music> musicList = new ArrayList<>();

        Music current = null;
        for (String line : lines) {
            if (StringUtils.isEmpty(line)) {
                continue;
            }

            if (line.contains("COURSE")) {
                current = new Music();
                current.setDiffculty(
                        convertDiffculty(
                                line.substring(line.indexOf(":") + 1)));
                musicList.add(current);
                continue;
            }

            if (current == null) {
                continue;
            }

            if (line.contains("LEVEL")) {
                current.setLevel(
                        Integer.parseInt(
                                line.substring(line.indexOf(":") + 1)));
                continue;
            }
            if (line.contains("BALLOON")) {
                String[] counts = line.substring(line.indexOf(":") + 1)
                        .split(",");

                for (String count : counts) {
                    current.getInfo().getBalloons().add(
                            Integer.parseInt(count.trim()));
                }
                continue;
            }
            if (line.contains("SCOREINIT")) {
                current.getInfo().setScoreInit(
                        Double.parseDouble(line.substring(line.indexOf(":") + 1)));
                continue;
            }
            if (line.contains("SCOREDIFF")) {
                current.getInfo().setScoreDiff(
                        Double.parseDouble(line.substring(line.indexOf(":") + 1)));
                continue;
            }

            line = line.replace(",", "").trim();
            current.getContent().add(line);
        }

        return musicList;
    }

    private Diffculty convertDiffculty(String type) {
        switch (type.trim()) {
            case "Edit":
                return Diffculty.EXTRA;
            case "Oni":
                return Diffculty.EXTREME;
            case "Hard":
                return Diffculty.HARD;
            case "Normal":
                return Diffculty.NORMAL;
            case "Easy":
                return Diffculty.EASY;
            default:
                throw new BusException("未知难度:" + type);
        }
    }


}
