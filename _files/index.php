<!DOCTYPE html>
<html>
	<head>
		<title>Index of <?php echo $_SERVER['REQUEST_URI'] ?></title>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
		<link rel="shortcut icon" type="image/x-icon" href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABqklEQVR42r3TzUrcUBQH8P9JzCQm8yHjB6iLqtAKDiiIM4iiIEIpdKF7d30CwRcoBaGbjg/gSnBnKbQKggiKrgR3MgguXLhQClN1mtFJZpJ7vDGhdbRdTIUeCFxuOL97c84J4ZlB/w1YeT8Z83zW5ZKJQO8+7Nt1wOf5rm4GCfDvpJrnY3SkR+sdm1gDmnPg6KUUQPYxvVoauAe81cxByUvkmLnuVFF1YGayEIoP4ZQenMeIt7SiaXiZ7nfOPqYrpRvHqEuueUj2vUTrUA6e/R1Q1Drc0hXo419D4PRTR1l7MWhBRD4LGOkOWOkEnOIJSGl6UhNTV2FMboUAH83x9Y9LufB+faOo3kLIGoBU/CksQ4E5tRcClZ0s27fekwYR/b1Jpk6wpg8jYDsjAUYjYRqE+OtCCJS3+tiuiMYAWcTUm9MI2Oz6pxuk3p5HwHqMbVdtCLA0H8mZKtHal43elLu72ILCrGA16FfwBNdRHuUIhJNUU0j4JfR/u9KmFiifXzLSbZ3tzVYyYeh6XE6jxuBgqIxHgCP74sjOVB3XLVduftqXxYvis//GO70Rl+fbNcvvAAAAAElFTkSuQmCC">
		<style type="text/css">
			* {
				margin: 0;
				padding: 0;
				vertical-align: baseline;
			}
			body {
				font: 14px "Helvetica Neue", Helvetica, Arial, sans-serif;
				background-color: #E6E6E6;
			}
			div#center {
				max-width: 600px;
				margin: 0 auto;
			}
			div#container {
				margin: 20px 10px;
				background-color: #FFF;
				-webkit-box-shadow:  0px 0px 5px 5px rgba(0, 0, 0, 0.12);
				box-shadow:  0px 0px 5px 5px rgba(0, 0, 0, 0.12);
			}
			div#content {
				padding: 15px 20px;
			}
			div#filelist {
				border-top: 1px solid #CCC;
				border-bottom: 1px solid #CCC;
				padding: 5px 0;
				margin: 0 0 5px 0;
			}
			h1 {
				color: #004A7F;
				font-size: 24px;
				font-weight: bold;
				margin: 0 0 10px 0;
			}
			a:link, a:visited {
				color: #404040;
				text-decoration: none;
			}
			a:hover, a:active {
				color: #C00;
				text-decoration: none;
			}
			li {
				list-style-type: none;
			}
			ul a {
				background-position: left center;
				background-repeat: no-repeat;
				background-color: transparent;
				display: block;
				padding: 4px 0 4px 20px;
				font-size: inherit;
			}
			.folder {
				font-weight: bold;
				background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABqklEQVR42r3TzUrcUBQH8P9JzCQm8yHjB6iLqtAKDiiIM4iiIEIpdKF7d30CwRcoBaGbjg/gSnBnKbQKggiKrgR3MgguXLhQClN1mtFJZpJ7vDGhdbRdTIUeCFxuOL97c84J4ZlB/w1YeT8Z83zW5ZKJQO8+7Nt1wOf5rm4GCfDvpJrnY3SkR+sdm1gDmnPg6KUUQPYxvVoauAe81cxByUvkmLnuVFF1YGayEIoP4ZQenMeIt7SiaXiZ7nfOPqYrpRvHqEuueUj2vUTrUA6e/R1Q1Drc0hXo419D4PRTR1l7MWhBRD4LGOkOWOkEnOIJSGl6UhNTV2FMboUAH83x9Y9LufB+faOo3kLIGoBU/CksQ4E5tRcClZ0s27fekwYR/b1Jpk6wpg8jYDsjAUYjYRqE+OtCCJS3+tiuiMYAWcTUm9MI2Oz6pxuk3p5HwHqMbVdtCLA0H8mZKtHal43elLu72ILCrGA16FfwBNdRHuUIhJNUU0j4JfR/u9KmFiifXzLSbZ3tzVYyYeh6XE6jxuBgqIxHgCP74sjOVB3XLVduftqXxYvis//GO70Rl+fbNcvvAAAAAElFTkSuQmCC');
			}
			.file {
				background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACo0lEQVR42o2TX0hTURzHf2fX7f5dm64bii0lIx96K6IeegqiwEzKooI0hU0S7C8+1EPSrGcTNB8SKxBKttTXICNKe5Bi1VIMk9ApU+e8V293brveu9O56w8MV/iDw7n3nB+f8/t+z+8g2ERUV5+k+/sHU7n20J+PBq9nx/GKw408z4o0Q4scy4gMS4s22rZVlmT7p1C43evxNP8T0Hip4VBH263hmLQCHMeC3S6QXZQZy7IC8koeHhke8dXX1/lyArxez77OtpsfRt+HoLx8J2wTXX8B8qoK63o+XkskYGjoZTOppG0DoLa2Zk93x+2x4OcJKC4uBJfLSSrhMoB4IgWLSwlMUYDmIxF8v/1hvt//fDULcP7c2bKeB3emxiamwOHcAqJYgI00RhaLBVgiiXiBE8kUaJqOrl1vtff2PlWzAGdOnyp+1NU6OzcfRbpuYEHgII0xwr9TqLw8yC9wgm6k002XW/i+vkAyC1BVVel60nV3KRqTwOGwI45nsWGkIUVOTGoa5gUeWa1W819vutLCBgIDehbgRGUF39Pp+zEXWUTkZMBkjVQCVpsNiopEzLIMcjodsBCVtKs3fIzfP4CzAMeOHrE97rq3tq5plEEALlKumcELHDaNpCgKEUdwZD62tr10r7DhFsyY/foutSzJVqKTaKZIL/BgsVDEi7TpBSayEClKLinbX5ATMD32RlFU1W46zzA0/iUFIQtlMd3HbncRIj2xWLLrQGFOwPfQ66gaj4vaug6mgeQOgaZtQPSbUjKzoibnSncfdOcEfPv4KqwoittsZZalQRD4zLqaSOlJzZiMSUpwOrzw9sLFhu6cgPHRF5NbBLZkVU1OLJHkSFQKfhmfDM6EZ0PP+vzqf1+jGXW1NeXxuDoT6B9MwibjJx1jKCCHOcg6AAAAAElFTkSuQmCC');
			}
			.phpmyadmin {
				background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjExR/NCNwAAAcdJREFUOE+NUE1rE1EUnS5c2Y0/QNF9V2ZbweBCFyHdiUi6jQ6IHyAGo9sUCqKYjQzBEggJiHQRbTUSVMREMknU0iapFgItJDFfxoaSVK3N6bl5Y5i48vJ4c+4959x732gYiwH6dfSq2N/DbhPtFatsi38MwPdVfHuPX11sxrEewl7fqv8Nu2EgLXs1VN+i/Rnpqyg/QfER9n9b/DBshn4DWb9F72whdgKdAhJumWMLm6H2DqkrFuY+seNo5vD6IhZPYvDHqo8Z1h7iww0Lv5nF0ylUkjLB0PA1bNXHDK9mkL0joPURjw9j+Sy2niN6DKFDiB7Fjy9D0cjAV5LYiAiOT0vX5HlZcmES8VOSvjg31I0M5m2pNjJofYIxIZjbN0wBS2dQMiTtlikcGn52ED4iXCuPly4BPJlb6BSlzt+1vSGaepoe2xv+L8TgdF7X9Qdut9/jCag0HE4QmGbJ4fBWKi1iCgIBeaHW7fbcrptEDEXzVhxFxAR0qo7EGhPn6Wu6d85z4W7wfsRM5Xw+g7SZKeiX5vXL9yiitFTa5M12GqezH20skWPKo5ZUFG9K1YRkMq+xxA+lKpSZtJIaxjOa1TOYBoOLB5mVawzsKOm2AAAAAElFTkSuQmCC');
			}
		</style>
	</head>
	
<body>
	
	<div id="center">
		<div id="container">
			<div id="content">
				<?php
				$exclude = array('.', '..', 'index.php');
				$content = scandir('.');
				$folders = array();
				$files = array();

				natcasesort($content);			
				foreach ($content as $item) {
					if ( ! in_array($item, $exclude)) {
						if (substr($item, 0, 1) != '.') {
							if (is_dir($item)) {
								$folders[] = $item;
							}
							else {
								$files[] = $item;
							}
						}
					}
				}
				
				echo "<h1>Index of {$_SERVER['REQUEST_URI']}</h1>";
				echo '<div id="filelist">';
				echo '<ul>';
				if ($folders) {
					foreach ($folders as $folder) {
						echo "<li><a href='{$folder}' class='folder'>{$folder}</a></li>";
					}
				}
				if ($files) {
					foreach ($files as $file) {
						echo "<li><a href='{$file}' class='file'>{$file}</a></li>";	
					}
				}
				echo '</ul>';
				echo '</div>';
				?>
				<ul>
					<li><a href="phpmyadmin" class="phpmyadmin">phpMyAdmin &raquo;</a></li>
				</ul>
			</div>
		</div>
	</div>
	
</body>

</html>