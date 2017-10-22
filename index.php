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

                    // Define the teams we should display as options
                    $debug_teams = array();
                    $debug_teams['thisTeam'] = 'Hero';
                    $debug_teams['targetTeam'] = 'Enemy';

                    // Define the fields we should display as options
                    $debug_fields = array();
                    $debug_fields['default'] = 'Default';

                    // Define the robots we should display as options
                    $debug_robots = array();
                    $debug_robots['default'] = 'Default';

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
                        <? $team_key = 0; foreach ($debug_teams as $team_token => $team_name) { ?>
                            <div style="background-color: rgba(0, 0, 0, <?= $team_key % 2 == 0 ? 0.1 : 0.2 ?>); padding: 3px 9px;">
                                <strong style="display: inline-block; min-width: 125px;">Add <?= $team_name ?> Robot:</strong>
                                <? foreach ($debug_robots as $robot_token => $robot_name) { ?>
                                    <a class="button" onclick="javascript:
                                        canvasGame.loadBattleRobot('<?= $team_token ?>',
                                            canvasGame.battleRobots['<?= $team_token ?>'].length,
                                            '<?= $robot_token ?>',
                                            canvasGame.findFirstEmptyCell('<?= $team_token ?>'),
                                            '<?= $team_key % 2 == 0 ? 'left' : 'right' ?>'
                                            );
                                        "><?= $robot_name ?></a>
                                <? } ?>
                            </div>
                        <? $team_key++; } ?>
                        <div style="background-color: rgba(0, 0, 0, 0.1); padding: 3px 9px;">
                            <strong style="display: inline-block; min-width: 125px;">Change Speed:</strong>
                            <a class="button" onclick="javascript:canvasGame.makeGameSlower();">Slower</a>
                            <a class="button" onclick="javascript:canvasGame.resetGameSpeed();">Reset</a>
                            <a class="button" onclick="javascript:canvasGame.makeGameFaster();">Faster</a>
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
        battleConfig.cacheDate = '<?= CANVASGAME_CACHE_DATE ?>';
        battleConfig.baseHref = '<?= CANVASGAME_BASE_HREF ?>';
        battleConfig.baseCorePath = '<?= CANVASGAME_CORE_PATH ?>';
        battleConfig.baseCustomPath = '<?= CANVASGAME_CUSTOM_PATH ?>';

        // Define a starter fields for this game
        battleConfig.baseFieldToken = 'default';

        // Define default hero robots for the game
        battleConfig.baseBattleRobots.thisTeam = [
            ['default', 'B2'],
            ];

        // Define default enemy robots for the game
        battleConfig.baseBattleRobots.targetTeam = [
            ['default', 'B2'],
            ];

    </script>

</body>
</html>