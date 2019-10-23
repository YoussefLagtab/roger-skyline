#include <stdlib.h>
#include <stdio.h>
#include <string.h>

int main()
{
	char *str;

	str = (char *)malloc(21);
	bzero(str, 21);
	strncpy(str, "abcdefghijklmnopqrstupqrstuvwxyz", 20);
	printf("%s | %p", str, str);
	return (0);
}
