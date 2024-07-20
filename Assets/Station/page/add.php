<?php

site()->layoutInit();
site()->load("Site\Station", "Station")

?>

<div class="page">
	<div class="container">
        <h1>Eve Station Fuel Manager</h1>
        <?=site()->Station->add()?>
    </div>
</div>

<?=site()->loadTemplate("site/footer-js")?>
<?=site()->bustJS("/js/station.js")?>

<?=site()->layout()?>
