import React, { useState, useEffect} from 'react';

const Form: React.FC<{ onArrayChange: (arr: string[]) => void }> = ({ onArrayChange }) => {

    const [defualt_d, setFirst] = useState<string>('');
    const [from1_d, setSecond] = useState<string>('');
    const [year1_d, setThird] = useState<string>('');
    const [from2_d, setFourth] = useState<string>('');
    const [year2_d, setFith] = useState<string>('');

    const getArrayOfStrings = () => {
        return [defualt_d, from1_d, from2_d, year1_d, year2_d] 
    };

    useEffect(() => {
        const arrayOfStrings = getArrayOfStrings();
        onArrayChange(arrayOfStrings);
      }, [defualt_d, from1_d, from2_d, year1_d, year2_d]);

    let [isFirstDropdownSelected, setIsFirstDropdownSelected] = useState(false);
    const [isSecondDropdownSelected, setIsSecondDropdownSelected] = useState(false);

    const handleFirstChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setFirst(event.target.value);
        setIsFirstDropdownSelected(event.target.value !== 'a');
        setSecond('');
        setThird('');
        setFourth('');
        setFith('');
        setIsSecondDropdownSelected(false);
        console.log("from1_d: " + event.target.value);
        const arrayOfStrings = getArrayOfStrings();
        onArrayChange(arrayOfStrings);
    };
    const handleSecondChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSecond(event.target.value);
        setIsSecondDropdownSelected(event.target.value !== 'a');
        setIsFirstDropdownSelected(false);
        setFirst('');
        if (event.target.value == 'option24') {
            setFith('option52');
            if (from2_d !== 'option42') { setFourth('option41') };
        };
        console.log("year1_d: " + event.target.value);
        const arrayOfStrings = getArrayOfStrings();
        onArrayChange(arrayOfStrings);
    };
    const handleThirdChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setThird(event.target.value);
        setIsSecondDropdownSelected(event.target.value !== 'a');
        setIsFirstDropdownSelected(false);
        setFirst('');
        if (event.target.value == 'option32') {
            setSecond('option21');
            setFith('option52');
            setFourth('option42');
        };
        console.log("year1_d: " + event.target.value);
        const arrayOfStrings = getArrayOfStrings();
        onArrayChange(arrayOfStrings);
    };
    const handleFourthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setFourth(event.target.value);
        setIsSecondDropdownSelected(event.target.value !== 'a');
        setIsFirstDropdownSelected(false);
        setFirst('');
        if (event.target.value !== '') {
            console.log("from1[7]" + (Number(from1_d[7])))
            console.log("from2[7]" + (Number(event.target.value[7])))
        };
        console.log("from2_d: " + event.target.value);
        const arrayOfStrings = getArrayOfStrings();
        onArrayChange(arrayOfStrings);
    };
    const handleFithChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setFith(event.target.value);
        setIsSecondDropdownSelected(event.target.value !== 'a');
        setIsFirstDropdownSelected(false);
        setFirst('');
        if (event.target.value == 'option51') {
            if (Number(from1_d[7]) >= Number(from2_d[7]))
                setFourth('option44')
        } else {
            setFourth('option42')
        };
        console.log("year2_d: " + event.target.value);
        const arrayOfStrings = getArrayOfStrings();
        onArrayChange(arrayOfStrings);
    };
    return (
        <form className='text-white'> 
            <div className="mb-5">
                <label htmlFor="firstDropdown">Quick Select: </label>
                <select
                    className={`styled-dropdown ${isSecondDropdownSelected ? 'inactive' : ''}`}
                    id="firstDropdown"
                    value={defualt_d}
                    onChange={handleFirstChange}
                >
                    <option value="">Select</option>
                    <option value="option11">Year over Year</option>
                    <option value="option12">Last Quarter to This Quarter</option>
                </select>
            </div>
            < header className="mb-4">
                Or
            </header>
            <div>
                <div className="space-x-36">
                    <label>From</label>
                    <label>Year</label>
                </div>

                <div className="space-x-28">
                    <select
                        className={`styled-dropdown ${isFirstDropdownSelected ? 'inactive' : ''}`}
                        id="secondDropdown"
                        value={from1_d}
                        onChange={handleSecondChange}
                    >
                        <option value="" disabled={year1_d !== '' || year2_d !== '' || from1_d !== '' || from2_d !== ''}>Select</option>
                        <option value="option21">Q1</option>
                        <option value="option22" disabled={year1_d == 'option32'}>Q2</option>
                        <option value="option23" disabled={year1_d == 'option32'}>Q3</option>
                        <option value="option24" disabled={year1_d == 'option32'}>Q4</option>
                    </select>

                    <select
                        className={`styled-dropdown ${isFirstDropdownSelected ? 'inactive' : ''}`}
                        id="thirdDropdown"
                        value={year1_d}
                        onChange={handleThirdChange}
                    >
                        <option value="" disabled={year1_d !== '' || year2_d !== '' || from1_d !== '' || from2_d !== ''}>Select</option>
                        <option value="option31">2024</option>
                        <option value="option32">2025</option>
                    </select>
                </div>
            </div>
            <header className="mb-2 mt-2">To</header>
            <div>
                <div className="space-x-36">
                    <label>From</label>
                    <label>Year</label>
                </div>

                <div className="space-x-28">
                    <select
                        className={`styled-dropdown ${isFirstDropdownSelected || from1_d == "" || year1_d == ""? 'reallyinactive' : ''}`}
                        id="fourthDropdown"
                        value={from2_d}
                        disabled={from1_d == "" || year1_d == ""}
                        onChange={handleFourthChange}
                    >
                        <option value="" disabled={year1_d !== '' || year2_d !== '' || from1_d !== '' || from2_d !== ''}>Select</option>
                        <option value="option41" disabled={year2_d === 'option51'
                            || ((Number(year1_d[7]) == Number(year2_d[7]))
                                && (Number(from1_d[7]) >= 1))}>Q1</option>
                        <option value="option42" disabled={(Number(year1_d[7]) == Number(year2_d[7])) && (Number(from1_d[7]) >= 2)}>Q2</option>
                        <option value="option43" disabled={year2_d === 'option52'
                            || ((Number(year1_d[7]) == Number(year1_d[7]))
                                && (Number(from1_d[7]) >= 3))}>Q3</option>
                        <option value="option44" disabled={year2_d === 'option52'
                            || ((Number(year1_d[7]) == Number(year1_d[7]))
                                && (Number(from1_d[7]) >= 4))}>Q4</option>
                    </select>
                    <select
                        className={`styled-dropdown ${isFirstDropdownSelected || from1_d == "" || year1_d == ""? 'reallyinactive' : ''}`}
                        id="fithDropdown"
                        value={year2_d}
                        disabled={from1_d == "" || year1_d == ""}
                        onChange={handleFithChange}
                    >
                        <option value="" disabled={year1_d !== '' || year2_d !== '' || from1_d !== '' || from2_d !== ''}>Select</option>
                        <option value="option51" disabled={year1_d == 'option32' || from1_d == 'option24'}>2024</option>
                        <option value="option52">2025</option>
                    </select>
                </div>
            </div>

        </form>
    );
};

export default Form;