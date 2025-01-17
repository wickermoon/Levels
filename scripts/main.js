Hooks.on("updateToken", (token, updates) => {
  if(!token?.object?.controlled) return;
  if("elevation" in updates) CONFIG.Levels.handlers.RefreshHandler.refreshPlaceables();
})

Hooks.on("controlToken", (token, controlled)=>{
  if(controlled){
    CONFIG.Levels.currentToken = token;
  }else{
    if(game.user.isGM && !canvas.tokens.controlled.length) CONFIG.Levels.currentToken = null;
  }
  CONFIG.Levels.handlers.RefreshHandler.refreshPlaceables();
})

Hooks.on("updateToken", (token, updates) => {
  if(token?.object?.controlled) CONFIG.Levels.handlers.DrawingHandler.executeStairs(updates, token);
});

Hooks.on("preUpdateToken", (token,updates) => {
  if(token.object && "elevation" in updates && !CONFIG.Levels?.useCollision3D){
    const elevDiff = token.object.document.elevation - updates.elevation;
    const p0 = {x:token.object.x,y:token.object.y,z:updates.elevation}
    const p1 = {x:token.object.x,y:token.object.y,z:token.object.losHeight-elevDiff+0.1}
    const collision = CONFIG.Levels.handlers.SightHandler.testCollision(p0, p1, "collision")
    if(collision){
      ui.notifications.error(game.i18n.localize("levels.err.collision"))
      if(!game.user.isGM) delete updates.elevation
    }
  }
})