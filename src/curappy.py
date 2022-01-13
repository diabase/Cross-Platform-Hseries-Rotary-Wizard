import sys


########

# Author: Nick Colleran
# Company: Diabase Engineering, LLC
preheatLines = sys.argv[1]
modifyGcode = sys.argv[2]
filepath = sys.argv[3]
newFilePath = sys.argv[4]


def get_number_from_string(string, char_before):
    number_found, number, int_length = False, '', 0
    for char in string:
        if not number_found:  # This if statement looks for the first P because we know the number will be right after
            if char == char_before:
                number_found = True
        else:
            if char == ' ' or char == "\n":  # This looks for a space because once a space is found, the number has ended. This is useful in case the number is ever multiple digits.
                break
            else:  # This else block adds each number after the p to a string, and counts how many digits this is so that I can reconstruct the string where the number leaves off.
                number += char
                int_length += 1
    return [number, int_length]

new_data, looking_for_retraction, looking_for_extrusion, found_extrusion, looking_for_swap, found_swap, first_tool, swap_value = [], False, False, False, False, False, True, ""
last_T = -1
if modifyGcode:
    with open(filepath, "r") as originalGcode:
        for line in originalGcode:
            if ";Extruder " in line:  # Looks for comments in the G-code that mention the changing of the extruder.
                # When the extruder changes, there are lots of things we have to look for.
                if line[-2].isdigit():
                    looking_for_retraction = True
                    looking_for_extrusion = True
                    looking_for_swap = True

                    if preheatLines != 0:
                        if not first_tool:  # It checks to make sure it is not the first tool.
                            # If we try to preheat the first tool, it will try to place the preheat line before the file even starts.
                            if len(new_data) >= preheatLines:  # This next section checks if there are at least 10 lines to place the pre-heat line back
                                new_data.insert(len(new_data) - preheatLines, "".join(
                                    ["M568 P", str(int(line[len(line) - 2])), " A2 ; Pre-heating tool\n"]))
                            else:  # If there are not 10 lines to place the preheat line back, it gets placed as far back as possible.
                                new_data.insert(0, "".join(
                                    ["M568 P", str(int(line[len(line) - 2])), " A2 ; Pre-heating tool\n"]))
                        first_tool = False
            if ";TYPE" in line and looking_for_extrusion:  # Once ";TYPE" is found, this sets a flag variable to true, indicating that we are looking to turn a G1 into a G11
                looking_for_extrusion = False
                found_extrusion = True
            if "M82" in line:
                line = ''  # This simply deletes all lines containing M82

            elif "M109" in line:  # This comments out all lines with M109 commands
                line = "".join([';', line])
                if "G10" in new_data[len(new_data) - 1]:
                    new_data.insert(len(new_data), "M568 P" + str(last_T) + " A2\n")
                    last_T = -1

            elif "G10 P" in line:  # Change G10 P# to G10 P(#+1)
                g10_number_values = get_number_from_string(line, "P")
                g10_number_string = g10_number_values[0]
                g10_number_length = g10_number_values[1]
                new_number_string = str(int(g10_number_string) + 1)
                string_after_number = line[5 + g10_number_length:len(line)]
                if " ".join([" Set tool", g10_number_string]) in string_after_number:
                    string_after_number = string_after_number.replace(
                        " ".join([" Set tool", g10_number_string]),
                        " ".join([" Set tool", str(int(
                            g10_number_string) + 1)]))  # This makes sure the increment is made in the comments as well

                line = "".join([line[0:5], new_number_string,
                                string_after_number])  # Replacing the line with the new version where one is added to the number after P

            elif "M104 T" in line:  # Replace M104 T# S$$$ with G10 P(#+1) S$$$ R($$$-50)
                m104_t_number_values = get_number_from_string(line, "T")
                m104_s_number_values = get_number_from_string(line, "S")

                line = "".join(["G10 P", str(int(m104_t_number_values[0]) + 1), " S", m104_s_number_values[
                    0], " R", str(int(m104_s_number_values[0]) - 50)])
            
            elif "M104 S" in line:
                after_S = int(get_number_from_string(line, 'S')[0])
                after_R = after_S - 50
                if last_T != -1:
                    line = "G10 P" + str(last_T) + " S" + str(after_S) + " R" + str(after_R)

            elif 'T' in line:  # All remaining lines with T# will be removed completely.
                for i in range(0, len(line) - 1):
                    if line[i] == 'T' and line[i + 1].isdigit():
                        last_T = int(line[i + 1]) + 1
                        line = ''
                        break

            elif ";Extruder end code" in line:  # Replace final retraction with “G10” (2 lines above ;Extruder end code)
                if len(new_data) >= 3:
                    new_data[
                        len(new_data) - 2] = "G1 E{-{tools[{state.currentTool}].retraction.length}} F{tools[{state.currentTool}].retraction.speed*60}\n"
                else:
                    new_data.append(
                        ";LAYER PROCESSING ERROR(editing G1 to G10)")  # Error catching, hopefully will never print

            elif "G1 " in line and found_extrusion and "E" in line:
                zLocation = 0
                for index in range(len(line)):
                    if line[index] == 'Z':
                        zLocation = index
                        break
                line = "G1 E{tools[{state.currentTool}].retraction.length} F{tools[{state.currentTool}].retraction.speed*60} ;" + line[zLocation: len(line)]

                found_extrusion = False
            elif "G1 " in line and looking_for_retraction:  # Remove post-tool-change Retraction
                line = "".join(['; Retraction Line Removed(', line[:-1], ')\n'])
                looking_for_retraction = False

            elif (
                    looking_for_swap or found_swap) and " X" in line and " Y" in line and " Z" in line:  # Catches case where no swap is needed
                swap_value = ''
                looking_for_swap = False
                found_swap = False

            elif looking_for_swap and "G1" in line and " Z" in line:  # Stores the first swap value
                swap_value = line
                looking_for_swap = False
                found_swap = True

            elif found_swap and " X" in line and " Y" in line:  # Complete the swap(wap XY move with Z move after tool-change)
                if len(new_data) >= 3:
                    new_data[len(new_data) - 2] = " ".join(
                        [line[:-1], ";Swapped\n"])
                    line = " ".join(
                        [swap_value[:-1], ";Swapped\n"])
                else:
                    new_data.append(
                        ";LAYER PROCESSING ERROR(Swapping)")  # Error catching, hopefully will never print
                swap_value = ''
                found_swap = False

            if '\n' not in line:
                line += '\n'
            if line != "" and line != "\n" and line != " ":  # Adds the edited line back to the data if it is not blank
                new_data.append(line)

with open(newFilePath, "w") as newFile:
    for line in new_data:
        newFile.write(line)