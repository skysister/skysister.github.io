<?php

namespace Site;

class Material
{
    public function __construct()
    {
        date_default_timezone_set("America/Chicago");
    }

    public function handleForm()
    {
        if (!empty($_POST["submitted"]) && $_POST["submitted"] == "material-analysis") {
            return $this->processInput($_POST["eveInput"]);
        }

        return site()->loadTemplate("material/form");
    }

    private function processInput($input)
    {
        $parsed = $this->parse($input);
        $calculated = $this->calculate($parsed);
        $analysis = $this->analyze($calculated);

        return site()->loadTemplate("material/report", ["sections" => $analysis]);
    }

    private function analyze($sections)
    {
        $least = null;
        $most = null;
        foreach ($sections as $s => $section) {
            foreach ($section as $i => $item) {
                $sections[$s][$i]["classes"] = [];
                if ($least == null || $item["Runs Available"] < $least["value"]) {
                    $least = compact("s", "i") + [ "value" => $item["Runs Available"] ];
                }
                if ($most == null || $item["Runs Available"] > $most["value"]) {
                    $most = compact("s", "i") + [ "value" => $item["Runs Available"] ];
                }
            }
        }
        $sections[$least["s"]][$least["i"]]["classes"][] = "item-least-runs";
        $sections[$most["s"]][$most["i"]]["classes"][] = "item-most-runs";
        
        return $sections;
    }

    private function calculate($sections)
    {
        foreach ($sections as $s => $section) {
            foreach ($section as $i => $item) {
                $sections[$s][$i]["Runs Available"] = $item["Available"] / $item["Required"];
            }
        }

       return $sections;
    }

    private function parse($input)
    {
        // split the input into an array of lines
        $lines = array_filter(preg_split("/\r\n|\n|\r/", $input));

        // group the lines by section
        $parsed = [];
        foreach ($lines as $line) {
            $line = trim($line);
            $tabs = substr_count($line, "\t");

            // add section array every time a trimmed line has no tabs and isn't empty
            if ($tabs == 0) {
                $parsed[$line] = [];
                $current = $line;
                $header = null;
                continue; // next line
            }

            // if there is no header, use this line
            if ($tabs > 0 && empty($header)) {
                $header = $this->parseLine($line);
                continue; // next line
            }
            
            // otherwise, it's data
            $parsed[$current][] = $this->parseLine($line, $header);
        }

        return $parsed;
    }

    private function parseLine($line, $keys = null)
    {
        $line = explode("\t", $line);

        if ($keys) {
            $line = array_combine($keys, $line);
        }

        return $line;
    }

    private function pre($message)
    {
        if (is_array($message)) {
            $message = print_r($message, true);
        }

        return "<pre class=\"text-white\">$message</pre>";
    }
}
