<?php

site()->layoutInit();
site()->load("Site\Station", "Station")

?>

<div class="page">
	<div class="container">
        <h1>Eve Station Fuel Manager</h1>
        <?=site()->Station->outputTable()?>
        <a class="btn btn-primary btn-hmc-b" href="/station/add">Add New Station</a>
    </div>
    <hr>
    <div class="container">
        Features
        <ul>
            <li>Distribute entered fuel evenly based on percentage</li>
            <li>Edit station record</li>
            <li>Add search and sort</li>
            <li>Add report</li>
            <li>Balance fuel</li>
            <li>Balance fuel input</li>
        </ul>
    </div>
</div>

<?=site()->loadTemplate("site/footer-js")?>
<?=site()->bustJS("/js/station.js")?>

<?=site()->layout()?>
