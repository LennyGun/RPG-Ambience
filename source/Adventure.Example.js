// This file is part of RPG Ambience
// Copyright 2012-2013 Jakob Kallin
// License: GNU GPL (http://www.gnu.org/licenses/gpl-3.0.txt)

Ambience.App.Adventure.Example = function() {
    var config = JSON.parse(Ambience.App.Adventure.Example.json);
	var adventure = Ambience.App.Adventure.fromConfig(config);
    return adventure;
};

Ambience.App.Adventure.Example.json = '{"title":"Example adventure","version":2,"creationDate":"2013-04-04T12:34:56.789Z","scenes":[{"name":"Theme","key":"T","layer":"background","mixin":false,"background":{"color":"#000000"},"fade":{"duration":0,"direction":"in out"},"image":{"file":null,"size":"contain"},"sound":{"tracks":[{"name":"9-Trailer_Music.ogg","id":"example:music","mimeType":"audio/ogg","$$hashKey":"02C","url":"example/9-Trailer_Music.ogg"}],"loop":false,"shuffle":false,"volume":100,"overlap":0},"text":{"string":"","size":5,"font":"","color":"#ffffff","bold":false,"italic":false,"alignment":"center","padding":0}},{"name":"Imagine","key":"1","layer":"foreground","mixin":false,"background":{"color":"#000000"},"fade":{"duration":1.6,"direction":"in out"},"image":{"file":null,"size":"contain"},"sound":{"tracks":[],"loop":true,"shuffle":false,"volume":100,"overlap":0},"text":{"string":"Don’t just imagine your world","size":4.5,"font":"Palatino Linotype, Georgia, serif","color":"#ffffff","bold":false,"italic":true,"alignment":"center","padding":0}},{"name":"Life","key":"2","layer":"foreground","mixin":false,"background":{"color":"#000000"},"fade":{"duration":1.6,"direction":"out"},"image":{"file":null,"size":"contain"},"sound":{"tracks":[],"loop":true,"shuffle":false,"volume":100,"overlap":0},"text":{"string":"Bring it to life","size":9,"font":"Palatino Linotype, Georgia, serif","color":"#ffffff","bold":false,"italic":true,"alignment":"center","padding":0}},{"name":"City","key":"C","layer":"foreground","mixin":false,"background":{"color":"#000000"},"fade":{"duration":4,"direction":"in out"},"image":{"file":{"id":"example:city","name":"ishtar_rooftop.jpg","url":"example/ishtar_rooftop.jpg"},"size":"cover"},"sound":{"tracks":[],"loop":true,"shuffle":false,"volume":100,"overlap":0},"text":{"string":"","size":5,"font":"","color":"#ffffff","bold":false,"italic":false,"alignment":"center","padding":0}},{"name":"Dragon","key":"D","layer":"foreground","mixin":false,"background":{"color":"#000000"},"fade":{"duration":3.2,"direction":"out"},"image":{"file":{"id":"example:dragon-image","name":"sintel-wallpaper-dragon.jpg","url":"example/sintel-wallpaper-dragon.jpg"},"size":"cover"},"sound":{"tracks":[{"name":"dragon.ogg","id":"example:dragon-sound","mimeType":"audio/ogg","url":"example/dragon.ogg"}],"loop":false,"shuffle":false,"volume":100,"overlap":0},"text":{"string":"","size":5,"font":"","color":"#ffffff","bold":false,"italic":false,"alignment":"center","padding":0}},{"name":"Ambience","key":"A","layer":"foreground","mixin":false,"background":{"color":"#000000"},"fade":{"duration":3.2,"direction":"in out"},"image":{"file":null,"size":"contain"},"sound":{"tracks":[],"loop":true,"shuffle":false,"volume":100,"overlap":0},"text":{"string":"RPG Ambience","size":9,"font":"Constantia, Georgia, serif","color":"#ffffff","bold":false,"italic":false,"alignment":"center","padding":0}}]}';