<?php $totalUsage = 0; ?>
<table data-template="<?= $template ?>" class="table table-sm table-station w-auto text-white">
    <tr>
        <th>Corp</th>
        <th>Solar System</th>
        <th>Type</th>
        <th>Name</th>
        <th>Nick Name</th>
        <th class="text-right">Daily</th>
        <th class="text-right">Weekly</th>
    </tr>
    <?php foreach ($stations as $station) : ?>
        <tr>
            <td><?= $station["corp"] ?></td>
            <td><?= $station["system"] ?></td>
            <td><?= $station["type"] ?></td>
            <td><?= $station["name"] ?></td>
            <td><?= $station["nick"] ?></td>
            <td class="text-right"><?=number_format($station["usage"], 0, ".", ",")?></td>
            <td class="text-right"><?=number_format($station["usage"] * 7, 0, ".", ",")?></td>
        </tr>
        <?php $totalUsage += $station["usage"]; ?>
    <?php endforeach; ?>
    <tr>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td>Totals</td>
        <td class="text-right"><?=number_format($totalUsage, 0, ".", ",")?></td>
        <td class="text-right"><?=number_format($totalUsage * 7, 0, ".", ",")?></td>
    </tr>
</table>

<style>
.table-station td, .table-station th { padding-left: 1em; padding-right: 1em; }
</style>
