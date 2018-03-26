#pragma once
#include "stdafx.h"
#include <vector>
#include <string>
#include <sstream>
#include <time.h>
#include <random>
#include <algorithm>

namespace ovrsalt {
    inline std::vector<std::string> SplitString (
        const std::string &strInput,
        const char &splitBy
    ) {
        std::stringstream ss(strInput);
        std::vector<std::string> result;

        while(ss.good()) {
            std::string substr;
            std::getline(ss, substr, splitBy);
            result.push_back(substr);
        }

        return result;
    }

    inline std::string GenerateID() {
		srand(time(NULL));
		auto randchar = []() -> char {
			const char charset[] =
				"0123456789"
				"ABCDEFGHIJKLMNOPQRSTUVWXYZ"
				"abcdefghijklmnopqrstuvwxyz";
			const size_t max_index = (sizeof(charset) - 1);
			return charset[rand() % max_index];
		};
		size_t length = 10;
		std::string str(length, 0);
		std::generate_n(str.begin(), length, randchar);
		return str;
	}

    
	inline std::wstring StringToWString(const std::string &s) {
		return std::wstring(s.begin(), s.end());
	}
}