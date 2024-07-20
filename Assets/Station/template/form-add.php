<form method="post">
    <div class="row">
        <div class="form-group col-md-2">
            <label for="input-corp">Corp Ticker</label>
            <input class="form-control" id="input-corp" name="corp">
        </div>
        <div class="form-group col-md-5">
            <label for="input-system">Solar System</label>
            <input class="form-control" id="input-system" name="system">
        </div>
        <div class="form-group col-md-5">
            <label for="input-type">Type</label>
            <select class="form-control" id="input-type" name="type">
                <option>Athanor</option>
                <option>Azbel</option>
                <option>Raitaru</option>
            </select>
        </div>
    </div>
    <div class="row">
        <div class="form-group col-md-2">
            <label for="input-usage">Daily Usage</label>
            <input class="form-control" id="input-usage" name="usage">
        </div>
        <div class="form-group col-md-5">
            <label for="input-name">Full Name</label>
            <input class="form-control" id="input-name" name="name">
        </div>
        <div class="form-group col-md-5">
            <label for="input-nick">Nick Name</label>
            <input class="form-control" id="input-nick" name="nick">
        </div>
    </div>
    <input type="hidden" name="submitted" value="station-add">
    <button class="btn btn-primary btn-hmc-b" type="submit">Save</button>
</form>
