#include "test.hpp"
#include <iostream>
#include <string>

test::test(void){
	return;
}

test::test(test const & src){
	*this->src = src;
	return;
}

test &	test::operator=(test const & rhs){
	return *this;
}

test::~test(void){
	return;
}
