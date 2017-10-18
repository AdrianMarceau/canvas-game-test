<?

// Include the game config
require('canvasGame/config.php');

?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf8" />
    <title>Canvas Game Test</title>
    <meta name="robots" content="noindex,nofollow" />
    <link type="text/css" rel="stylesheet" href="styles/style.css?<?= CANVASGAME_CACHE_DATE ?>" />
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

    <script type="text/javascript" src="scripts/jquery-3.2.1.min.js?<?= CANVASGAME_CACHE_DATE ?>"></script>
    <script type="text/javascript" src="scripts/legacyPolyfills.js?<?= CANVASGAME_CACHE_DATE ?>"></script>

    <script type="text/javascript" src="canvasGame/indexes/resourceIndex.js?<?= CANVASGAME_CACHE_DATE ?>"></script>
    <script type="text/javascript" src="canvasGame/canvasGame.2k17.js?<?= CANVASGAME_CACHE_DATE ?>"></script>

    <script type="text/javascript" src="scripts/script.js?<?= CANVASGAME_CACHE_DATE ?>"></script>

    <script type="text/javascript">

        // Update environments for the game
        battleConfig.baseHref = '<?= CANVASGAME_BASE_HREF ?>';
        battleConfig.baseCorePath = '<?= CANVASGAME_CORE_PATH ?>';
        battleConfig.baseCustomPath = '<?= CANVASGAME_CUSTOM_PATH ?>';

        // Define a starter fields for this game
        battleConfig.baseFieldToken = 'default';

        // Define default hero robots for the game
        battleConfig.baseBattleRobots.thisTeam = [
            ['default', 'C2'],
            ['default', 'B1'],
            ['default', 'B3']
            ];

        // Define default enemy robots for the game
        battleConfig.baseBattleRobots.targetTeam = [
            ['default', 'C2'],
            ['default', 'B1'],
            ['default', 'B3']
            ];

    </script>

</body>
</html>