<?

// Define a cache timestamp to force-refresh assets
$cache_timestamp = '2017-10-14A';

?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf8" />
    <title>Canvas Game Test</title>
    <meta name="robots" content="noindex,nofollow" />
    <link type="text/css" rel="stylesheet" href="styles/style.css?<?= $cache_timestamp ?>" />
</head>
<body>
    <div class="wrapper">

        <div class="header">
            <h1>Canvas Game Test</h1>
        </div>

        <div class="game no-console">

            <div class="canvas">
                <canvas width="962" height="248"></canvas>
            </div>

            <div class="console">
                <div class="wrap">
                    <div>- console -</div>
                </div>
            </div>

            <div class="buttons">
                <div class="wrap">
                    <div style="clear: both; padding-bottom: 4px;">
                        <a class="button pause" data-state="on">Pause Game</a>
                        <a class="button debug" data-state="off">Show Debug</a>
                    </div>
                    <?

                    // Define the fields we should display as options
                    $debug_fields = array();
                    $debug_fields['default'] = 'None';

                    ?>
                    <div style="text-align: left; overflow: hidden;">
                        <div style="background-color: rgba(0, 0, 0, 0.2); padding: 3px 9px;">
                            <strong style="display: inline-block; min-width: 125px;">Change Field:</strong>
                            <? foreach ($debug_fields as $field_token => $field_name) { ?>
                                <a class="button" onclick="javascript:canvasGame.changeField('<?= $field_token ?>');"><?= $field_name ?></a>
                            <? } ?>
                        </div>
                        <div style="background-color: rgba(0, 0, 0, 0.1); padding: 3px 9px;">
                            <strong style="display: inline-block; min-width: 125px;">Change Background:</strong>
                            <? foreach ($debug_fields as $field_token => $field_name) { ?>
                                <a class="button" onclick="javascript:canvasGame.changeFieldBackground('<?= $field_token ?>');"><?= $field_name ?></a>
                            <? } ?>
                        </div>
                        <div style="background-color: rgba(0, 0, 0, 0.2); padding: 3px 9px;">
                            <strong style="display: inline-block; min-width: 125px;">Change Foreground:</strong>
                            <? foreach ($debug_fields as $field_token => $field_name) { ?>
                                <a class="button" onclick="javascript:canvasGame.changeFieldForeground('<?= $field_token ?>');"><?= $field_name ?></a>
                            <? } ?>
                        </div>
                        <div style="background-color: rgba(0, 0, 0, 0.1); padding: 3px 9px;">
                            <strong style="display: inline-block; min-width: 125px;">Change Speed:</strong>
                            <a class="button" onclick="javascript:canvasGame.makeGameSlower();">Slower</a>
                            <a class="button" onclick="javascript:canvasGame.resetGameSpeed();">Reset</a>
                            <a class="button" onclick="javascript:canvasGame.makeGameFaster();">Faster</a>
                        </div>
                        <div style="background-color: rgba(0, 0, 0, 0.2); padding: 3px 9px;">
                            <strong style="display: inline-block; min-width: 125px;">Add New Robot:</strong>
                            <a class="button" onclick="javascript:
                                canvasGame.loadBattleRobot('thisTeam', canvasGame.battleRobots.thisTeam.length, 'default', canvasGame.findFirstEmptyCell('thisTeam'), 'left');
                                ">This Team</a>
                            <a class="button" onclick="javascript:
                                canvasGame.loadBattleRobot('targetTeam', canvasGame.battleRobots.targetTeam.length, 'default', canvasGame.findFirstEmptyCell('targetTeam'), 'right');
                                ">Target Team</a>
                        </div>
                    </div>
                </div>
            </div>

        </div>

    </div>

    <script type="text/javascript" src="scripts/jquery-3.2.1.min.js?<?= $cache_timestamp ?>"></script>
    <script type="text/javascript" src="scripts/polyfills.js?<?= $cache_timestamp ?>"></script>

    <script type="text/javascript" src="scripts/canvasGame.2k17.js?<?= $cache_timestamp ?>"></script>

    <script type="text/javascript" src="scripts/canvasGame.gameSprite.js?<?= $cache_timestamp ?>"></script>

    <script type="text/javascript" src="scripts/canvasGame.resourceManager.js?<?= $cache_timestamp ?>"></script>

    <script type="text/javascript" src="scripts/canvasGame.fieldIndex.js?<?= $cache_timestamp ?>"></script>
    <script type="text/javascript" src="scripts/canvasGame.robotIndex.js?<?= $cache_timestamp ?>"></script>

    <script type="text/javascript" src="objects/fields/index.js.php?<?= $cache_timestamp ?>"></script>
    <script type="text/javascript" src="objects/robots/index.js.php?<?= $cache_timestamp ?>"></script>

    <script type="text/javascript" src="scripts/script.js?<?= $cache_timestamp ?>"></script>

    <script type="text/javascript">

        // Update variables for this test instance
        battleConfig.fieldToken = 'default';

        // Define default player robots for the game
        battleConfig.battleRobots.thisTeam = [
            ['default', 'C2'],
            ['default', 'B1'],
            ['default', 'B3']
            ];

        // Define default target robots for the game
        battleConfig.battleRobots.targetTeam = [
            ['default', 'C2'],
            ['default', 'B1'],
            ['default', 'B3']
            ];

    </script>

</body>
</html>