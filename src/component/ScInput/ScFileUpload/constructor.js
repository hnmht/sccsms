// Voucher attachment list to file list
export const voucherFilesToFiles = (voucherFiles) => {
    if (!voucherFiles) {
        return [];
    }
    let files = []; 
    voucherFiles.forEach(voucherFile => {
        if (voucherFile.dr === 0 && voucherFile.file.id > 0) {
            files.push(voucherFile.file);
        }
    });
    return files;
}

// Files list to voucher attachment list
export const filesToVoucherFiles = (voucherFiles, files) => {
    if (!voucherFiles) {
        return [];
    }
    // Filter out files that have been deleted
    for (let i = 0; i < voucherFiles.length; i++) {
        let fileIndex = files.findIndex(file => file.id === voucherFiles[i].file.id);
        if (fileIndex < 0) {
            voucherFiles[i].dr = 1;
        }
    } 
    // Filter out newly added files
    let newVoucherFiles = [];
    for (let i = 0; i < files.length; i++) {
        let voucherFileIndex = voucherFiles.findIndex(voucherFile => voucherFile.file.id === files[i].id);
        if (voucherFileIndex < 0) {
            let newVoucherFile = { id: 0, billhid: 0, billbid: 0, file: files[i], dr: 0 };
            newVoucherFiles.push(newVoucherFile);
        } else {
            if (voucherFiles[voucherFileIndex].dr === 1) {
                voucherFiles[voucherFileIndex].dr = 0;
            }
        }
    }    
    const fs = [...voucherFiles, ...newVoucherFiles];
    // Refine fs by deleting items where id equals 0 and dr equals 1
    for (let i=0;i<fs.length;i++) {
        if (fs[i].id === 0 && fs[i].dr === 1) {
            fs.splice(i,1);
            i--
        }
    }

    return fs;
};