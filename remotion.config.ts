import {Config} from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(92);
Config.setOverwriteOutput(true);
Config.setCodec('h264');
Config.setPixelFormat('yuv420p');
Config.setCrf(18);
Config.setAudioCodec('aac');
Config.setAudioBitrate('192k');
Config.setChromiumOpenGlRenderer('swangle');
Config.setBrowserExecutable('/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell');
Config.setDelayRenderTimeoutInMilliseconds(120000);
