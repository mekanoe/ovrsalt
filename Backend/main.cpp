#include "stdafx.h"
#include "OVRSalt.h"
#include "Overlay.h"
#include <chrono>
#include <thread>

using namespace ovrsalt;

int main(int argc, char **argv) {
    OVRSalt salt = OVRSalt();
        
    // Try starting VR. It's not ok if it fails, but we'll try a few times.
    int nRetry = 0;
    while (!salt.StartVR() && nRetry < 10) {
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

	std::cin.ignore();
	return 0;
}
