#include "stdafx.h"
#include "OVRSalt.h"
#include <chrono>
#include <thread>

using namespace ovrsalt;

// i like ascii art, go away.
void printStartup() {
    std::cout << std::endl
<< "  $$$$$$\\  $$\\    $$\\ $$$$$$$\\   $$$$$$\\            $$\\   $$\\      "
    << std::endl
<< " $$  __$$\\ $$ |   $$ |$$  __$$\\ $$  __$$\\           $$ |  $$ |    " 
    << std::endl
<< " $$ /  $$ |$$ |   $$ |$$ |  $$ |$$ /  \\__| $$$$$$\\  $$ |$$$$$$\\   "
    << std::endl
<< " $$ |  $$ |\\$$\\  $$  |$$$$$$$  |\\$$$$$$\\   \\____$$\\ $$ |\\_$$  _|  "
    << std::endl
<< " $$ |  $$ | \\$$\\$$  / $$  __$$<  \\____$$\\  $$$$$$$ |$$ |  $$ |    "
    << std::endl
<< " $$ |  $$ |  \\$$$  /  $$ |  $$ |$$\\   $$ |$$  __$$ |$$ |  $$ |$$\\ "
    << std::endl
<< "  $$$$$$  |   \\$  /   $$ |  $$ |\\$$$$$$  |\\$$$$$$$ |$$ |  \\$$$$  |"
    << std::endl
<< "  \\______/     \\_/    \\__|  \\__| \\______/  \\_______|\\__|   \\____/"
    << std::endl 
<< " ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
    << std::endl << std::endl;
}

int main(int argc, char **argv) {
    printStartup();

    OVRSalt clSalt = OVRSalt();
        
    // Try starting VR. It's not ok if it fails, but we'll try a few times.
    int nRetry = 0;
    while (!clSalt.StartVR() && nRetry < 10) {
        nRetry++;
        std::cout << "-- Retrying VR init in 2 seconds..." << std::endl << std::endl;
        std::this_thread::sleep_for(std::chrono::seconds(2));
    }

    if (nRetry >= 10) {
        std::cerr << "!! VR System failed to start. Is SteamVR (or other implementation) ok?" << std::endl;
		return 1;
	} else {
		std::cout << "** VR System started successfully!" << std::endl;
	}


    // Try starting overlays...
	std::string strOverlays = "";

    if (argc > 1) {
        strOverlays = argv[1];
    }

    clSalt.StartOverlays(strOverlays);

    // wait forever-ish, this is the lazy way for now.
	std::cin.ignore();

    std::cout << "++ Shutting down..." << std::endl;
    clSalt.Shutdown();
	
    return 0;
}
