# soap2day-downloader

Sadly, soap2day has been shut down :( It was great while it lasted!

## ~~Chrome Extension coming soon!!~~


## By JDipi
#### Ty to Joey for the motivation
___
Downloads TV shows and Movies from soap2day.to

___
## Prerequisites
___
Install Tampermonkey - [tutorial](https://www.youtube.com/watch?v=kjeERqWY04s)

Make sure to do the following after you install Tampermonkey, or else your default download directory will be flooded with media files when you try to download them:

  1) Go to your Tampermonkey dashboard
  2) Click settings
  3) Change the 1st option (Config Mode) to "Advanced"
  4) Scroll down to "Downloads BETA"
  5) Change "Download Mode" to "Browser API"
  6) Save and exit, accept the new "Manage Download" 
     permission if prompted.
___


## Usage

# !!! IMPORTANT !!! this script works best with an adblocker


<p align="center">To start, click the download icons on each episode, season, or movie you want to download</p>

<p align="center">
  <img src="https://user-images.githubusercontent.com/48573618/205460890-6d72a93c-4812-4c08-806f-60f3233bc046.png" width="70%"/>
  <img src="https://user-images.githubusercontent.com/48573618/205461069-89fc850e-abc5-495b-b1b3-31446e6877c5.png" width="70%"/>
</p>


<p align="center">Doing this will add them to the download queue, which will appear in the top right of the screen. The queue will be saved across soap2day pages, so downloading multiple movies or TV episodes is possible.</p>

<p align="center">
  <img src="https://user-images.githubusercontent.com/48573618/205461407-de859dba-4359-454f-932c-a9bdb408c0ea.png" width="70%"/>
</p>

<p align="center">Pressing the download button will briefly open each episode in a new background tab in order to grab the source url for the video. After this, the extra tabs will close and the media will begin downloading to a new folder in your default download location.</p>



## Stuff I will fix

- Make it work on other soap2day domains
- Clean up the GM_getValue and GM_setValues (hopefully making it less buggy)
- Make a way to remove items from the queue
