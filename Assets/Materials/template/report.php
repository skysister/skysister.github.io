<p>Prepared <?=date("l, F j, Y @ g:i:s a")?></p>
<table class="table table-sm table-material w-auto text-white">
    <?php foreach ($sections as $s => $section) : ?>
        <tr>
            <th colspan="4">
                <h4 class="m-0"><?=$s?></h4>
            </th>
            <th class="gap"></th>
            <th colspan="2">
                <?php if ($s == array_key_first($sections)) : ?>
                    <input type="number" data-materialonchange="calculateFill" class="form-control form-control-sm">
                <?php endif; ?>
            </th>
        </tr>
        <tr>
            <th>Item</th>
            <th class="text-right">Required</th>
            <th class="text-right">Available</th>
            <th class="text-right">Runs</th>
            <th class="gap"></th>
            <th class="quantity">Quantity</th>
            <th class="price">Est. Ƶ</th>
        </tr>
        <?php foreach ($section as $r => $row) : ?>
            <tr class="item <?=implode(" ", $row["classes"])?>">
                <td data-price="<?=$row["Est. Unit price"]?>" data-typeid="<?=$row["typeID"]?>">
                    <?=$row["Item"]?>
                </td>
                <td data-required="<?=$row["Required"]?>" class="text-right">
                    <?=number_format($row["Required"])?>
                </td>
                <td data-available="<?=$row["Available"]?>" class="text-right">
                    <?=number_format($row["Available"])?>
                </td>
                <td data-runsavailable="<?=$row["Runs Available"]?>" class="text-right">
                    <span title="<?=$row["Runs Available"]?>">
                        <?=number_format(floor($row["Runs Available"]))?>
                    </span>
                </td>
                <td class="gap"></td>
                <td class="quantity"></td>
                <td class="price"></td>
            </tr>
        <?php endforeach; ?>
    <?php endforeach; ?>
    <tr class="total">
        <th colspan="4">
            <h4 class="m-0">Total Estimated Price</h4>
        </th>
        <th class="gap"></th>
        <th>&nbsp;</th>
        <th class="price"></th>
    </tr>
</table>
<a class="btn btn-primary btn-hmc-b" href="/material">OK</a>

<style>
.table-material td, .table-material th { padding-left: 1em; padding-right: 1em; }
.table-material td:first-child { padding-left: 2em; }
.table-material .item-least-runs td { background: rgba(255, 127, 0, 0.2); }
.table-material .item-most-runs td { background: rgba(0, 255, 127, 0.1); }
.table-material .total th { border-top-width: 2px; border-bottom: 2px solid white; }
.table-material .gap { border: none !important; padding: 5px; }
.table-material .quantity, .table-material .price { text-align: center; }
</style>
