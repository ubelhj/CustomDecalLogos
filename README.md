# CustomDecalLogos

Add your logo to a Rocket League decal! Draws any .png on top of an existing decal or a blank base. Currently supports Breakout, Dominus, Octane, and Harbinger.

Either make one decal or a full car set (based on the decals I have available to me). See what decals are available in img/.

## Usage
### First install
First make sure you have node.js installed  
Open a powershell or command line window in the same directory as the .js files.  
Before the first use, type `npm install`. This will install Jimp and Async, the only dependencies for this project.  
Next open your `defaultvalues.json`. Modify this to point at your decal folder.  
The default is `C:\Program Files (x86)\Steam\steamapps\common\rocketleague\Binaries\Win64\bakkesmod\data\acplugin\DecalTextures`  
The beginning of the path is based on your Bakkesmod Folder, so in the BakkesMod window hit file -> open bakkesmod folder. 
Your texture path will be the location of this folder followed by `\data\acplugin\DecalTextures`.

By default all skins are bound to no decal, so other users will see you as a stock, undecaled car.

### createdecal.js
This creates a single decal with your logo  
Usage:  
`node createdecal.js logolocation.png decalname carID basedecal writeJSON`  
There are only two required arguments, the first two  
The first argument `logolocation.png` is your logo to add to the decal  
The second is the name of your new decal. In Alphaconsole it will display as `decalname - basedecal`  
The third is optional, and is the ID of the car. You can find these in the img/ folder. It defaults to 22, which is Breakout.  
The fourth is also optional, and is the name of the decal. You can find these in img/carID. Just do the name, no .png. It defaults to basedecal, which is an empty decal.
The fifth is also optional, and decides whether to write a JSON file. This is only really there for createdecalset, so I don't recommend changing it. It defaults to true.  

`node createdecal.js heart.png breakoutHeart` creates a blank decal with heart.png on it for Breakout.  
You can select it in Alphaconsole as `breakoutHeart - basedecal`  
`node createdecal.js circle.png octaneStripesWithCircle 23 stripes` creates the stripes decal with circle.png on it for Octane  
You can select it in Alphaconsole as `octaneStripesWithCircle - stripes`  

### createdecalset.js
This creates a set of decals with your logo for the same car  
Makes one decal for each base decal named in CarID/decalnames.json  
Usage:  
`node createdecalset.js logolocation.png decalname carID`  
There are only two required arguments, the first two  
The first argument `logolocation.png` is your logo to add to the decal  
The second is the name of your new decal. In Alphaconsole it will display as `decalname - basedecal`  
The third is optional, and is the ID of the car. You can find these in the img/ folder. Currently supported are 22 (Breakout), 23 (Octane), and 403 (Dominus). It defaults to Breakout if there is no input.  

`node createdecalset.js heart.png breakoutHeart` creates a set of decals, all with heart.png on top. They will be named similarly in alphaconsole.  
To name a few, you will have `breakoutHeart - stripes` and `breakoutHeart - basedecal`  
`node createdecalset.js circle.png octaneCircle` creates a set of octane decals with circle.png on top.

### Usable CarIDs
22 = Breakout (default)  
23 = Octane  
403 = Dominus  
4906 = Harbinger
