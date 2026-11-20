import {Config} from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(92);
Config.setCodec('h264');
Config.setCrf(18);
Config.setPixelFormat('yuv420p');
Config.setAudioCodec('aac');
// WebGL (Three.js) en rendu headless
Config.setChromiumOpenGlRenderer('angle');
Config.setConcurrency(3);
