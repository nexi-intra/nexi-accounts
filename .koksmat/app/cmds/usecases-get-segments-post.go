// -------------------------------------------------------------------
// Generated by 365admin-publish
// -------------------------------------------------------------------
/*
---
title: Get Segments
---
*/
package cmds

import (
	"context"
	"encoding/json"
	"fmt"
	"os"
	"path"

	"github.com/magicbutton/magic-master/execution"
	"github.com/magicbutton/magic-master/schemas"
	"github.com/magicbutton/magic-master/utils"
)

func UsecasesGetSegmentsPost(ctx context.Context, args []string) (*schemas.AllSegments, error) {

	result, pwsherr := execution.ExecutePowerShell("john", "*", "magic-master", "05-usecases", "10-get-segments.ps1", "")
	if pwsherr != nil {
		return nil, pwsherr
	}

	resultingFile := path.Join(utils.WorkDir("magic-master"), "all-segments.json")
	data, err := os.ReadFile(resultingFile)
	if err != nil {
		return nil, err
	}
	resultObject := schemas.AllSegments{}
	err = json.Unmarshal(data, &resultObject)
	if utils.Output == "json" {
		fmt.Println(string(data))
	}
	utils.PrintSkip2FirstAnd2LastLines(string(result))

	return nil, nil

}