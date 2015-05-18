<?php
namespace Test\Entity;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;

/** 
 * @ORM\Entity
 * @ORM\Table(name="UserGroup")
 */
class Group {
    /**
	 * @ORM\Id
	 * @ORM\GeneratedValue(strategy="AUTO")
	 * @ORM\Column(type="integer")
	 */
	protected $id;

	/** @ORM\Column(type="string", length=255, nullable=true) */
	protected $code;
	
	/** @ORM\Column(type="string", length=255) */
	protected $name;

	/** @ORM\Column(type="boolean", nullable=true) */
	protected $focalpoint;
	
	/** @ORM\Column(type="boolean", nullable=true) */
	protected $administrator;
	
	/** @ORM\ManyToMany(targetEntity="Grant") */
	protected $grants;
	
	/** @ORM\ManyToOne(targetEntity="Sector") */
	protected $sector;
	
	public function __construct(){
		$this->grants = new ArrayCollection();
	}
	
	public function getId(){
	    return $this->id;
	}
    
    public function setId($id){
    	$this->id = $id;
    }
    
    public function getName(){
    	return $this->name;
    }
    
    public function setName($name){
    	$this->name = $name;
    }
    
    public function getCode(){
    	return $this->code;
    }
    
    public function setCode($code){
    	$this->code = $code;
    }
    
    public function getGrants(){
    	return $this->grants;
    }
    
    public function setGrants($grants){
    	$this->grants = $grants;
    }
    
    public function getSector(){
    	return $this->sector;
    }
    
    public function setSector($sector){
    	$this->sector = $sector;
    }
    
    public function isAdministrator(){
    	return $this->administrator?:false;
    }
    
    public function setAdministrator($administrator){
    	$this->administrator = $administrator;
    }
    
    public function isFocalpoint(){
    	return $this->focalpoint?:false;
    }
    
    public function setFocalpoint($focalpoint){
    	$this->focalpoint = $focalpoint;
    }
}